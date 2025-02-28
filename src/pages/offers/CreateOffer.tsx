import OfferForm from '../../components/offers/OfferForm';

const CreateOffer = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Offer</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <OfferForm />
      </div>
    </div>
  );
};

export default CreateOffer;