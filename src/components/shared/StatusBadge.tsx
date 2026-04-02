interface StatusBadgeProps {
  status: "Completed" | "Pending" | "Failed" | "Good" | "Active" | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getClass = () => {
    switch (status) {
      case "Completed":
      case "Good":
      case "Active":
        return "badge-success";
      case "Pending":
        return "badge-warning";
      case "Failed":
        return "badge-danger";
      default:
        return "badge-info";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
