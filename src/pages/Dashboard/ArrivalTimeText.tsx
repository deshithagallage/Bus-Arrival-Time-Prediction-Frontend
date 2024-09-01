const ArrivalTimeText = ({
  time,
  colour = false,
}: {
  time: number | undefined;
  colour?: boolean;
}) => {
  const formattedTimeText = (time: number | undefined) => {
    if (time === undefined) {
      return "N/A";
    }
    if (time < 1) {
      return "Due";
    }
    //return time as a range of mins without decimals
    return `${Math.floor(time)} - ${Math.ceil(time)}`;
  };

  const getColour = (time: number | undefined) => {
    if (time === undefined) {
      return "";
    }
    if (time < 10) {
      return "green-500";
    }
    //return time as a range of mins without decimals
    return `red-500`;
  };
  return (
    <>
      {colour ? (
        <span className={`text-${getColour(time)} font-bold`}>
          {formattedTimeText(time)}
        </span>
      ) : (
        <span className="font-bold">{formattedTimeText(time)}</span>
      )}
    </>
  );
};

export default ArrivalTimeText;
