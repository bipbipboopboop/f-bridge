import GreenButton from "../buttons/button.green";

const Chatbox = () => {
  return (
    <>
      <h4>Chat</h4>
      <div style={{height: "90%", border: "1px solid"}}></div>
      <div className="d-flex" style={{height: "10%", border: "1px solid"}}>
        <input
          type="text"
          className="h-100 w-75"
          style={{fontSize: "0.5rem"}}
        />
        <GreenButton>Send</GreenButton>
      </div>
    </>
  );
};

export default Chatbox;
