export const Typography = ({ variant = 'body', children }: { variant?: string, children: React.ReactNode }) => {
    let className = '';
  
    switch (variant) {
      case 'h1':
        className = 'text-4xl font-bold';
        break;
      case 'h2':
        className = 'text-2xl font-semibold';
        break;
      case 'body':
      default:
        className = 'text-base';
        break;
    }
  
    return <div className={className}>{children}</div>;
  };
  