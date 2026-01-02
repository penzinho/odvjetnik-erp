import PageHeader from "@/components/PageHeader";
import SudForm from "@/components/SudForm";

export default function NoviSudPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Novi Sud" subtitle="Unesite podatke o sudu." />
      <SudForm />
    </div>
  );
}