import ContractForm from '../../components/contracts/ContractForm';

const CreateContract = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Contract</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <ContractForm />
      </div>
    </div>
  );
};

export default CreateContract;