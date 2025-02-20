"use client"
import { useState } from 'react';

interface TextH1Props {
    text: string;
    hoverOptions?: [string?, string?]; // Tupla opcional contendo a cor do shadow no hover e a URL
    isRefreshLink?: boolean; // Propriedade opcional para definir se é um link de refresh
}

export default function TextH1({ text, hoverOptions = [], isRefreshLink = false }: TextH1Props) {
    const [hoverShadowColor, url] = hoverOptions;
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleRefresh = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.reload(); // Faz o refresh da página
    };

    const titleStyle = {
        textShadow: isHovered
            ? `3px 3px 1px ${hoverShadowColor || 'rgba(0, 0, 0, 0.3)'}` // Aplica a cor do hover se existir
            : '4px 4px black', // Volta para o valor padrão
            cursor: url || isRefreshLink ? 'pointer' : 'default',
            transition: 'text-shadow 0.3s ease-in-out',
    };

    return (
        <div className="cmp-h1">
            {isRefreshLink ? (
                <a href="/" style={titleStyle} onClick={handleRefresh} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <h1>{text.toUpperCase()}</h1>
                </a>
            ) : url ? (
                <a href={url} style={titleStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <h1>{text.toUpperCase()}</h1>
                </a>
            ) : (
                <h1
                    style={titleStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {text.toUpperCase()}
                </h1>
            )}
        </div>
    );
}