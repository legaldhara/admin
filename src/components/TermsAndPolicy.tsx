const TermsAndPolicy = () => {
    return (
      <div className="text-sm text-gray-700 max-h-[300px] overflow-y-auto p-4">
        <h2 className="font-black text-center text-lg mb-4">Terms and Policy</h2>
  
        <ol className="space-y-4 list-decimal list-inside">
          <li>
            <strong>Introduction</strong><br />
            By using NexaShopping Pvt. Ltd. E-Commerce platform, you agree to these terms.
          </li>
  
          <li>
            <strong>Account Registration</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Users can register independently or be referred by a distributor.</li>
              <li>Distributors must be approved by the admin.</li>
            </ul>
          </li>
  
          <li>
            <strong>Credit-Based Transactions</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Admin provides products on credit to distributors.</li>
              <li>Distributors can extend credit to users.</li>
              <li>Credit limits and repayment terms are determined by the admin.</li>
            </ul>
          </li>
  
          <li>
            <strong>Order Processing & Payments</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Users must clear pending dues before placing new credit-based orders.</li>
              <li>Non-payment may result in account suspension or legal action.</li>
            </ul>
          </li>
  
          <li>
            <strong>Limitation of Liability</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>We are not responsible for disputes between distributors and users.</li>
              <li>Pricing and product availability may change without notice.</li>
            </ul>
          </li>
  
          <li>
            <strong>Termination</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>We reserve the right to terminate accounts for fraudulent activities.</li>
              <li>Users can deactivate their accounts by contacting support.</li>
            </ul>
          </li>
  
          <li>
            <strong>Contact Us</strong><br />
            For any legal inquiries, contact [support email].
          </li>
        </ol>
      </div>
    );
  };
  
  export default TermsAndPolicy;
  