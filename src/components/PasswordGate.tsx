import React, { useState, useRef, useEffect } from 'react';

interface PasswordGateProps {
  onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === import.meta.env.VITE_PASSWORD) {
      onUnlock();
    } else {
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 500);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          style={{
            background: 'color-mix(in srgb, currentColor 6%, transparent)',
            border: 'none',
            outline: 'none',
            borderRadius: '18px',
            padding: '13px 22px',
            fontSize: '16px',
            textAlign: 'center',
            width: '120px',
            color: 'inherit',
            letterSpacing: '0.15em',
            animation: shake ? 'shake 0.4s ease' : 'none',
          }}
        />
      </form>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default PasswordGate;
