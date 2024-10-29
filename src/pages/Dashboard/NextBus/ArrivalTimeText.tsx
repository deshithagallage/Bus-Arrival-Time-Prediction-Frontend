const ArrivalTimeText = ({
  time,
  colour = false,
  isDuration = false,
}: {
  time: number | undefined;
  colour?: boolean;
  isDuration?: boolean;
}) => {
  const formattedTimeText = (time: number | undefined) => {
    if (time === undefined) {
      return "N/A";
    }

    time = time * (Math.random() * (6 - 5) + 5);

    const minutes = Math.floor(time);
    const seconds = Math.floor((time - minutes) * 60);

    // Format for duration or arrival time
    if (isDuration) {
      return `${minutes} min ${seconds} sec`;
    }
    return `${minutes} min ${seconds} sec`;
  };

  const getColour = (time: number | undefined) => {
    if (time === undefined) {
      return "";
    }
    return time < 5 ? "text-green-500" : "text-red-500";
  };

  return (
    <span className={`${colour ? getColour(time) : ""} font-bold`}>
      {formattedTimeText(time)}
    </span>
  );
};

export default ArrivalTimeText;
