import { useParams, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import OfferForm from '../../components/offers/OfferForm';

const UpdateOffer = () => {
  const { id } = useParams<{ id: string }>();
  const offer = useAppSelector((state) => 
    state.offers.offers.find((o) => o.id === id)
  );

  if (!offer) {
    return <Navigate to="/offers" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Update Offer</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <OfferForm initialData={offer} isEditing={true} />
      </div>
    </div>
  );
};

export default UpdateOffer;