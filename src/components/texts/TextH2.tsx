interface TextH2Props {
    text: string;
    color?: string | null;
}

export default function TextH2({ text, color }: TextH2Props) {
    return (
        <div className="cmp-text-h2">
            <h2 style={{ color: color || 'white' }}>{text.toUpperCase()}</h2>
        </div>
    );
}
