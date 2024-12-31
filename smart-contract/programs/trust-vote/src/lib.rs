use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("3oWPRMbutojB8VSp5ApfVyNqiZg69Eti51aJ8uJ7Xw6q");

#[program]
mod trust_vote {
    use super::*;
    pub fn initialize_voting_session(
        ctx: Context<InitializeVotingSession>,
        name: String,
        active: bool,
    ) -> Result<()> {
        let voting_session = &mut ctx.accounts.voting_session;
        voting_session.name = name;
        voting_session.active = active;
        msg!("Voting Session Initialized."); // Message will show up in the tx logs
        Ok(())
    }

    pub fn configure_voting_session(
        ctx: Context<ConigureVotingSession>,
        active: bool,
    ) -> Result<()> {
        let voting_session = &mut ctx.accounts.voting_session;
        voting_session.active = active;
        msg!("Voting Session: {}", voting_session.active);
        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        id: String,
        name: String,
        affiliation: String,
    ) -> Result<()> {
        let new_candidate = &mut ctx.accounts.data;
        new_candidate.id = id;
        new_candidate.name = name;
        new_candidate.affiliation = affiliation;
        new_candidate.votes = 0;
        msg!("New candidate created: {}", new_candidate.name);
        Ok(())
    }

    pub fn cast_vote(ctx: Context<Vote>, voter_id: String, candidate_id: String) -> Result<()> {
        let voting_session = &ctx.accounts.vote_session;
        if !voting_session.active {
            msg!("Voting Session is inactive. Votes can only be cast if the voting session is active.");
            return Err(ErrorCode::VotingSessionInactive.into());
        }
        let vote_data = &mut ctx.accounts.vote_data;
        vote_data.voter_id = voter_id;
        vote_data.candidate_id = candidate_id;
        let candidate = &mut ctx.accounts.candidate;
        candidate.votes += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(init, payer=user, space=8+20+28)]
    pub vote_data: Account<'info, VoteData>,
    #[account(mut)]
    pub candidate: Account<'info, Candidate>,
    #[account(mut)]
    pub vote_session: Account<'info, VotingSession>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeVotingSession<'info> {
    #[account(init, payer = signer, space = 8 + 4+32 + 1)]
    pub voting_session: Account<'info, VotingSession>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ConigureVotingSession<'info> {
    #[account(mut)]
    pub voting_session: Account<'info, VotingSession>,
}

#[derive(Accounts)]
pub struct InitializeCandidate<'info> {
    #[account(init, payer=user, space=8+(4+24)+(4+50)+(4+12)+8)]
    pub data: Account<'info, Candidate>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VotingSession {
    name: String, //4+32
    active: bool, //1
}

#[account]
pub struct Candidate {
    id: String,          // 4+24
    name: String,        //4+50
    affiliation: String, // 4+12
    votes: u64,          // 8
}

#[account]
pub struct VoteData {
    voter_id: String,     //4+16
    candidate_id: String, //4+24
}

#[error_code]
pub enum ErrorCode {
    #[msg("The voting session is inactive. No votes can be cast at this time.")]
    VotingSessionInactive,
}