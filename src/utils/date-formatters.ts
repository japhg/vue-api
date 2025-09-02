export const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
        return new Intl.DateTimeFormat("en-PH", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}
