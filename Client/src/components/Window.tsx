interface WindowProps {
    title: string;
    onClose?: () => void;
    maxWidth?: string | number;
    children?: React.ReactNode;
}

export function Window ({title,onClose,maxWidth='500px', children}: WindowProps) {
    return (
        <div className="y2k-window" style={{ maxWidth, margin: '0 auto'}}>
            <div className= "y2k-window-header">
                <div className="y2k-window-title">{title} </div>
                <div className="y2k-window-controls">
                    <span className="2yk-window-dot"></span>
                    <span
                        className={`y2k-control-dot ${onClose ? 'close' : ''}`}
                        onClick={onClose}
                    ></span>
                </div>
                
                </div>
            <div className="y2k-window-body">
                {children}
            </div>
            
            
        </div>

    );
}