import "./tutorial.css";

const Tutorial = () => {
  return (
    <>
      <h1 className="tutorial-title" style={{ position: "sticky", top: "0" }}>
        Floating Bridge Tutorial
      </h1>
      <div className="tutorial-container">
        <div className="tutorial-content">
          <h2 className="section-title">Objective</h2>
          <p className="section-description">
            The objective of the game is to score points by winning tricks (rounds) as a team with your partner.
          </p>
          <h2 className="section-title">Setup</h2>
          <p className="section-description">
            The game is played with a standard deck of 52 cards. Each player is dealt a hand of cards.
          </p>
          <h2 className="section-title">Bidding</h2>
          <p className="section-description">
            In the bidding phase, players take turns making bids to determine the trump suit and the contract (number of
            tricks to win).
          </p>
          <p>The higher you bid, the more tricks you need to win.</p>
          <h2 className="section-title">Taking Tricks</h2>
          <p className="section-description">
            After the bidding phase, the player to the right of the highest bidder leads the first trick, and players
            must follow suit if possible, ortherwise, they can play any suit they like. The player who wins the trick
            leads the next one.
          </p>
          <h2 className="section-title">Scoring</h2>
          <p className="section-description">
            At the end of each round, points are awarded based on the contract and the number of tricks won by each
            team.
          </p>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
