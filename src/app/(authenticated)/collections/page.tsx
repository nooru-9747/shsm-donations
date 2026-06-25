import { getMemberBalances } from "@/app/actions/collections";
import CollectionsClient from "@/components/collections/CollectionsClient";

export default async function CollectionsPage() {
  const balances = await getMemberBalances();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-900">Collections</h1>
        <p className="mt-1 text-sm text-emerald-600">
          Mark monthly payments and view outstanding dues.
        </p>
      </div>

      <CollectionsClient balances={balances} />
    </div>
  );
}
