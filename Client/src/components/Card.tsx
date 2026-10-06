import type {ReactNode} from "react";

interface CardProps{
    image: ReactNode;
    title: string;
    subtitle?: string;
    tags?: ReactNode;
    actions?: ReactNode;
    isInactive?: boolean;
    className?: string;
    onClick?: () => void;
}

export function Card({ image, title, subtitle, tags, actions, isInactive = false, className = "", onClick }: CardProps){
    return (
        <div className={`y2k-generic-card ${isInactive ? "is-inactive" : ""} ${className}`}
             onClick={onClick}>
            { image && <div className="card-media"> {image}</div> }
            
            <div className = "card-body">
                <div className= "card-header-row">
                    <div className="card-title-group">
                        <span className = "card-title">{ title }</span>
                        {tags && <div className="card-tags">{tags}</div>}
                    </div>
                </div>
                {subtitle && <div className="card-subtitle">{ subtitle }</div>}
            </div>
            {actions && <div className="card-actions">{ actions }</div>}
        </div>
    );
}