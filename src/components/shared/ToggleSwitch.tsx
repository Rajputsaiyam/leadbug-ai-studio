interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <div
      className={`toggle-track ${checked ? "active" : ""}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <div className="toggle-thumb" />
    </div>
  );
};

export default ToggleSwitch;
