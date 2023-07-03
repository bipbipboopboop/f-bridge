import { BiddingPhase } from "types/GameRoom";
import { Bid, BidNumber, BidSuit } from "types/Bid";
import { FC, HTMLAttributes, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import BidButton from "../../buttons/button-bid";
import useFunctions from "../../../hooks/useFunctions";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import { getPossibleBids } from "../../../utils/bid";

type BiddingOptionsPanelProps = {
  biddingPhase: BiddingPhase;
};

const BiddingOptionsPanel: FC<HTMLAttributes<HTMLDivElement> & BiddingOptionsPanelProps> = ({ ...props }) => {
  const {
    biddingPhase: { currentPlayerIndex, highestBid, gameroomPlayersList },
    ...divProps
  } = props;

  const [selectedBidValue, setSelectedBidValue] = useState<BidNumber | null>(null);
  const [selectedBidSuit, setSelectedBidSuit] = useState<BidSuit | null>(null);

  const { playerProfile } = useAuth();

  const possibleBids = getPossibleBids(highestBid);
  const currentBidder = gameroomPlayersList.find((plyr) => plyr.position === currentPlayerIndex)!;
  const isMyTurnToBid = currentBidder.id === playerProfile?.id;

  const { placeBid, isLoading, error } = useFunctions();

  if (error) {
    toast.error(error.message);
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isMyTurnToBid) return <></>;

  // console.log({possibleBids, highestBid, selectedBidValue, selectedBidSuit});
  return (
    <div {...divProps}>
      <div className="w-100">
        <div className="d-flex">
          {[1, 2, 3, 4, 5, 6].map((bidValue) => (
            <BidButton
              style={{ marginRight: "0.5rem", border: `${bidValue === selectedBidValue ? "5px solid #BD8E63" : ""}` }}
              key={bidValue}
              disabled={possibleBids[bidValue as 1].length === 0}
              onClick={() => {
                setSelectedBidValue(bidValue as 1);
              }}
            >
              {bidValue}
            </BidButton>
          ))}
          <BidButton
            style={{ width: "6rem" }}
            onClick={() => {
              placeBid({ isPass: true, number: 0, suit: "♣" });
              setSelectedBidSuit(null);
              setSelectedBidValue(null);
            }}
          >
            Pass
          </BidButton>
        </div>
        <div className="d-flex">
          {selectedBidValue && (
            <>
              {(["♣", "♦", "♥", "♠", "NT"] as BidSuit[]).map((suit) => (
                <BidButton
                  style={{
                    marginTop: "0.5rem",
                    marginRight: "0.5rem",
                    color: `${suit === "♦" || suit === "♥" ? "#ff525d" : "black"}`,
                    fontSize: `${suit === "NT" ? "1rem" : "2rem"}`,
                    border: `${suit === selectedBidSuit ? "5px solid #BD8E63" : ""}`,
                  }}
                  key={suit}
                  disabled={!possibleBids[selectedBidValue].includes(suit)}
                  onClick={() => {
                    setSelectedBidSuit(suit);
                  }}
                >
                  {suit}
                </BidButton>
              ))}
              <BidButton
                style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
                onClick={() => {
                  setSelectedBidValue(null);
                  setSelectedBidSuit(null);
                }}
              >
                ↩︎︎
              </BidButton>
              <BidButton
                style={{ width: "6rem", marginTop: "0.5rem" }}
                disabled={!selectedBidSuit}
                onClick={() => {
                  placeBid({ isPass: false, number: selectedBidValue, suit: selectedBidSuit! });
                  setSelectedBidSuit(null);
                  setSelectedBidValue(null);
                }}
              >
                Bid
              </BidButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiddingOptionsPanel;
