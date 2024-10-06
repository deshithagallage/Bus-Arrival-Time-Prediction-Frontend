import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Landing Page</h1>
      <Link
        to="/nextbus"
        className="text-lg font-bold text-indigo-600 dark:text-indigo-400"
      >
        When is my next bus?
      </Link>
      <Link
        to="/stats"
        className="text-lg font-bold text-indigo-600 dark:text-indigo-400"
      >
        Insights
      </Link>
    </div>
  );
}

export default Landing;
