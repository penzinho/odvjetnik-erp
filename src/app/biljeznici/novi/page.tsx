import PageHeader from "@/components/PageHeader";
import BiljeznikForm from "@/components/BiljeznikForm";

export default function NoviBiljeznikPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Novi Bilježnik" subtitle="Unesite podatke o javnom bilježniku." />
      <BiljeznikForm />
    </div>
  );
}
