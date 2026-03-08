import SectionItem from "./SectionItem";
import Spinner from "../common/Spinner";
import Alert from "../common/Alert";

export default function SubjectSidebar({ subjectId, tree, loading, error }) {
  if (loading) return <Spinner />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!tree) return null;

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold">{tree.title}</h2>
      <p className="mb-4 text-xs text-gray-500">Course roadmap</p>
      {tree.sections.map((section) => (
        <SectionItem key={section.id} subjectId={subjectId} section={section} />
      ))}
    </div>
  );
}
