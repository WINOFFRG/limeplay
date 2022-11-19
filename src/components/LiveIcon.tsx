export default function LiveIcon({ state }: { state: boolean }) {
    return state ? (
        <>
            <div className="red-dot"></div>
            <div className="live-text">LIVE</div>
        </>
    ) : (
        <div className="live-text">GO TO LIVE</div>
    );
}
