interface TextH3Props {
    text: string;
}

export default function TextH3({ text }: TextH3Props) {
    return (
        <div className="cmp-text-h3">
            <h3>{text.toUpperCase()}</h3>
        </div>
    );
}
