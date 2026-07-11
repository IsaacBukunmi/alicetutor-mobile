export const getToday = () => {
    const now = new Date()
    const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' })
    const day = now.getDate()
    const month = now.toLocaleDateString('en-GB', { month: 'long' })
    return `${weekday}, ${day} ${month}`
}

export const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}