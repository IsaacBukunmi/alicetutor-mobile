export const Colors = {
    primary: '#185FA5',
    primaryLight: '#1E6FB8',
    primaryDark: '#124C84',
  
    aliceFrom: '#2E7FD1',
    aliceTo: '#17A8C4',
  
    // Surfaces
    bgApp: '#F4F6FA',
    bgBoard: '#E9ECF1',
    bgCard: '#FFFFFF',
    borderCard: '#EAEFF6',
    borderInput: '#E3E9F1',
    divider: '#EEF2F7',
  
    // Ink
    inkHeading: '#0F1B2D',
    inkBody: '#33475B',
    inkSecondary: '#64748B',
    inkMuted: '#94A3B5',
  
    // Accents
    amber: '#F59E0B',
    amberSoft: '#FFF4E2',
    amberText: '#D97706',
    green: '#16A34A',
    greenSoft: '#EDF8F1',
    greenText: '#15803D',
    red: '#EF4444',
    redSoft: '#FDECEC',
    redText: '#DC2626',
    purple: '#7C3AED',
    purpleSoft: '#F1EBFE',
    indigo: '#4F46E5',
    indigoSoft: '#ECEBFE',
    blue: '#2563EB',
    blueSoft: '#eaf2fb',
    blueBorder: '#cfe0f3'
} as const

export const FontFamily = {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semibold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
    extrabold: 'PlusJakartaSans-ExtraBold',
} as const

export const Radius = {
    card: 16,
    cardLg: 20,
    section: 20,
    sectionLg: 24,
    pill: 999,
    btn: 14,
    tile: 12,
} as const

export const Shadows = {
    card: {
        shadowColor: '#0F1B2D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    primaryBtn: {
        shadowColor: '#185FA5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 22,
        elevation: 8,
    },
} as const