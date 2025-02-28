import { useParams, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import ContractForm from '../../components/contracts/ContractForm';

const UpdateContract = () => {
  const { id } = useParams<{ id: string }>();
  const contract = useAppSelector((state) => 
    state.contracts.contracts.find((c) => c.id === id)
  );

  if (!contract) {
    return <Navigate to="/contracts" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Update Contract</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <ContractForm initialData={contract} isEditing={true} />
      </div>
    </div>
  );
};

export default UpdateContract;