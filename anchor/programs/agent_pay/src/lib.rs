use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("54ZZfUHiT4AM3nvnipZzJWDumVdXTmdMQuSb4Yc2TzUg");

#[program]
pub mod agent_pay {
    use super::*;
    /// Initialize the agent registry
    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.agent_count = 0;
        registry.total_volume = 0;
        Ok(())
    }

    /// Register a new agent with hotkey/coldkey pair
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        hotkey: Pubkey,
        daily_limit: u64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        let registry = &mut ctx.accounts.registry;

        agent.coldkey = ctx.accounts.coldkey.key();
        agent.hotkey = hotkey;
        agent.daily_limit = daily_limit;
        agent.daily_spent = 0;
        agent.last_reset_timestamp = Clock::get()?.unix_timestamp;
        agent.is_active = true;
        agent.total_received = 0;
        agent.total_sent = 0;
        agent.bump = ctx.bumps.agent;

        registry.agent_count += 1;

        emit!(AgentRegistered {
            coldkey: agent.coldkey,
            hotkey: agent.hotkey,
            daily_limit: agent.daily_limit,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Update agent spending limit
    pub fn update_agent_limit(
        ctx: Context<UpdateAgent>,
        new_limit: u64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        require!(
            ctx.accounts.coldkey.key() == agent.coldkey,
            ErrorCode::UnauthorizedColdkey
        );

        agent.daily_limit = new_limit;

        emit!(AgentLimitUpdated {
            hotkey: agent.hotkey,
            new_limit,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Deactivate an agent
    pub fn deactivate_agent(ctx: Context<UpdateAgent>) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        require!(
            ctx.accounts.coldkey.key() == agent.coldkey,
            ErrorCode::UnauthorizedColdkey
        );

        agent.is_active = false;

        emit!(AgentDeactivated {
            hotkey: agent.hotkey,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// User pays an agent (USDC transfer to coldkey)
    pub fn pay_agent(
        ctx: Context<PayAgent>,
        amount: u64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        require!(agent.is_active, ErrorCode::AgentInactive);

        // Transfer USDC from user to agent's coldkey
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.coldkey_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        agent.total_received += amount;
        ctx.accounts.registry.total_volume += amount;

        emit!(PaymentMade {
            from: ctx.accounts.user.key(),
            to_agent: agent.hotkey,
            to_coldkey: agent.coldkey,
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Agent initiates payment (within daily limit)
    pub fn agent_pay(
        ctx: Context<AgentPay>,
        amount: u64,
    ) -> Result<()> {
        // 1. Initial Checks and Immutable Accesses (NO mutable borrow of 'agent' yet)
        let clock = Clock::get()?;
        let current_agent = &ctx.accounts.agent; // Use immutable access for checks and lookups

        require!(current_agent.is_active, ErrorCode::AgentInactive);
        require!(
            ctx.accounts.hotkey.key() == current_agent.hotkey,
            ErrorCode::UnauthorizedHotkey
        );

        // 2. CPI Setup (Immutable access to ctx.accounts.agent for authority)
        // Transfer USDC from coldkey to recipient
        let seeds = &[
            b"agent",
            current_agent.coldkey.as_ref(), // Immutable read is fine here
            current_agent.hotkey.as_ref(),   // Immutable read is fine here
            &[current_agent.bump],           // Immutable read is fine here
        ];
        
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.coldkey_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            // This is the IMMUTABLE BORROW point - we use the account info directly
            authority: ctx.accounts.agent.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?; // CPI is completed. Immutable borrow ends.

        // 3. Mutable Update Logic (SAFE to start mutable borrow now)
        let agent = &mut ctx.accounts.agent; // MUTABLE BORROW starts here

        // Reset daily spending if new day
        if clock.unix_timestamp - agent.last_reset_timestamp >= 86400 {
            agent.daily_spent = 0;
            agent.last_reset_timestamp = clock.unix_timestamp;
        }

        // Check daily limit (needs to be checked *after* potential reset)
        require!(
            agent.daily_spent + amount <= agent.daily_limit,
            ErrorCode::DailyLimitExceeded
        );

        // Update spending
        agent.daily_spent += amount;
        agent.total_sent += amount;

        // 4. Finalize
        emit!(AgentPaymentMade {
            agent: agent.hotkey,
            recipient: ctx.accounts.recipient.key(),
            amount,
            daily_spent: agent.daily_spent,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Agent requests payment approval
/// Agent requests payment approval
pub fn request_payment(
    ctx: Context<RequestPayment>,
    amount: u64,
    purpose: String,
    request_nonce: i64,  // Must match #[instruction]
) -> Result<()> {
    let agent = &ctx.accounts.agent;
    let request = &mut ctx.accounts.payment_request;
    let clock = Clock::get()?;

    require!(agent.is_active, ErrorCode::AgentInactive);
    require!(
        ctx.accounts.hotkey.key() == agent.hotkey,
        ErrorCode::UnauthorizedHotkey
    );
    require!(purpose.len() <= 200, ErrorCode::PurposeTooLong);

    request.agent = agent.key();
    request.hotkey = agent.hotkey;
    request.coldkey = agent.coldkey;
    request.recipient = ctx.accounts.recipient.key();
    request.amount = amount;
    request.purpose = purpose;
    request.status = PaymentStatus::Pending;
    request.requested_at = clock.unix_timestamp;
    request.bump = ctx.bumps.payment_request;

    emit!(PaymentRequested {
        request_id: request.key(),
        agent: agent.hotkey,
        recipient: ctx.accounts.recipient.key(),
        amount,
        timestamp: request.requested_at,
    });

    Ok(())
}




    /// Coldkey approves payment request
    pub fn approve_payment(ctx: Context<ApprovePayment>) -> Result<()> {
        let request = &mut ctx.accounts.payment_request;
        let agent = &ctx.accounts.agent;

        require!(
            ctx.accounts.coldkey.key() == agent.coldkey,
            ErrorCode::UnauthorizedColdkey
        );
        require!(
            request.status == PaymentStatus::Pending,
            ErrorCode::RequestNotPending
        );

        // Transfer USDC from coldkey to recipient
        let cpi_accounts = Transfer {
            from: ctx.accounts.coldkey_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.coldkey.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, request.amount)?;

        request.status = PaymentStatus::Approved;
        request.processed_at = Some(Clock::get()?.unix_timestamp);

        emit!(PaymentApproved {
            request_id: request.key(),
            agent: agent.hotkey,
            recipient: request.recipient,
            amount: request.amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Coldkey rejects payment request
    pub fn reject_payment(ctx: Context<ApprovePayment>) -> Result<()> {
        let request = &mut ctx.accounts.payment_request;
        let agent = &ctx.accounts.agent;

        require!(
            ctx.accounts.coldkey.key() == agent.coldkey,
            ErrorCode::UnauthorizedColdkey
        );
        require!(
            request.status == PaymentStatus::Pending,
            ErrorCode::RequestNotPending
        );

        request.status = PaymentStatus::Rejected;
        request.processed_at = Some(Clock::get()?.unix_timestamp);

        emit!(PaymentRejected {
            request_id: request.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// Contexts
#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Registry::LEN,
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(hotkey: Pubkey)]
pub struct RegisterAgent<'info> {
    #[account(
        init,
        payer = coldkey,
        space = 8 + Agent::LEN,
        seeds = [b"agent", coldkey.key().as_ref(), hotkey.as_ref()],
        bump
    )]
    pub agent: Account<'info, Agent>,
    #[account(mut)]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub coldkey: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    #[account(mut)]
    pub agent: Account<'info, Agent>,
    pub coldkey: Signer<'info>,
}

#[derive(Accounts)]
pub struct PayAgent<'info> {
    #[account(mut)]
    pub agent: Account<'info, Agent>,
    #[account(mut)]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub coldkey_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AgentPay<'info> {
    #[account(mut)]
    pub agent: Account<'info, Agent>,
    pub hotkey: Signer<'info>,
    /// CHECK: recipient address
    pub recipient: AccountInfo<'info>,
    #[account(mut)]
    pub coldkey_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(amount: u64, purpose: String, request_nonce: i64)]
pub struct RequestPayment<'info> {
    #[account(
        init,
        payer = hotkey,
        space = 8 + PaymentRequest::LEN,
        seeds = [
            b"payment_request",
            agent.key().as_ref(),
            hotkey.key().as_ref(),
            &request_nonce.to_le_bytes()
        ],
        bump
    )]
    pub payment_request: Account<'info, PaymentRequest>,
    pub agent: Account<'info, Agent>,
    #[account(mut)]
    pub hotkey: Signer<'info>,
    /// CHECK: recipient address
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApprovePayment<'info> {
    #[account(mut)]
    pub payment_request: Account<'info, PaymentRequest>,
    pub agent: Account<'info, Agent>,
    pub coldkey: Signer<'info>,
    #[account(mut)]
    pub coldkey_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// Accounts
#[account]
pub struct Registry {
    pub authority: Pubkey,
    pub agent_count: u64,
    pub total_volume: u64,
}

impl Registry {
    pub const LEN: usize = 32 + 8 + 8;
}

#[account]
pub struct Agent {
    pub coldkey: Pubkey,
    pub hotkey: Pubkey,
    pub daily_limit: u64,
    pub daily_spent: u64,
    pub last_reset_timestamp: i64,
    pub is_active: bool,
    pub total_received: u64,
    pub total_sent: u64,
    pub bump: u8,
}

impl Agent {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1 + 8 + 8 + 1;
}

#[account]
pub struct PaymentRequest {
    pub agent: Pubkey,
    pub hotkey: Pubkey,
    pub coldkey: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub purpose: String,
    pub status: PaymentStatus,
    pub requested_at: i64,
    pub processed_at: Option<i64>,
    pub bump: u8,
}

impl PaymentRequest {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 8 + (4 + 200) + 1 + 8 + (1 + 8) + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PaymentStatus {
    Pending,
    Approved,
    Rejected,
}

// Events
#[event]
pub struct AgentRegistered {
    pub coldkey: Pubkey,
    pub hotkey: Pubkey,
    pub daily_limit: u64,
    pub timestamp: i64,
}

#[event]
pub struct AgentLimitUpdated {
    pub hotkey: Pubkey,
    pub new_limit: u64,
    pub timestamp: i64,
}

#[event]
pub struct AgentDeactivated {
    pub hotkey: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PaymentMade {
    pub from: Pubkey,
    pub to_agent: Pubkey,
    pub to_coldkey: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct AgentPaymentMade {
    pub agent: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub daily_spent: u64,
    pub timestamp: i64,
}

#[event]
pub struct PaymentRequested {
    pub request_id: Pubkey,
    pub agent: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct PaymentApproved {
    pub request_id: Pubkey,
    pub agent: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct PaymentRejected {
    pub request_id: Pubkey,
    pub timestamp: i64,
}

// Errors
#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Only the coldkey can perform this action")]
    UnauthorizedColdkey,
    #[msg("Unauthorized: Only the hotkey can perform this action")]
    UnauthorizedHotkey,
    #[msg("Agent is not active")]
    AgentInactive,
    #[msg("Daily spending limit exceeded")]
    DailyLimitExceeded,
    #[msg("Payment request is not pending")]
    RequestNotPending,
    #[msg("Purpose description is too long (max 200 characters)")]
    PurposeTooLong,
}