import LiveExamRoom from "./LiveExamRoom";
import OthersExamRoom from "./OthersExamRoom";

const ExamRoomWrapper = ({ examType }) => {
  if (examType === "live") return <LiveExamRoom />;
  return <OthersExamRoom />;
};

export default ExamRoomWrapper;
