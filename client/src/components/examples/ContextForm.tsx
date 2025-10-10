import ContextForm from "../ContextForm";

export default function ContextFormExample() {
  return (
    <ContextForm
      onSubmit={(context) => console.log("Context submitted:", context)}
      onSkip={() => console.log("Context skipped")}
    />
  );
}
