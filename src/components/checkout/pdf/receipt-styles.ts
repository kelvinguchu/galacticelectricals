import { StyleSheet, Font } from '@react-pdf/renderer'

Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w-Y3tcoqK5.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf',
      fontWeight: 700,
    },
  ],
})

const BRAND = {
  primary: '#048afb',
  secondary: '#feb100',
  dark: '#0a2742',
  muted: '#6b7280',
  light: '#f9fafb',
  border: '#e5e7eb',
  white: '#ffffff',
  accent: '#e6f3ff',
} as const

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    color: '#1a1a1a',
    backgroundColor: BRAND.white,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  brandBlock: {
    flexDirection: 'column',
    maxWidth: '60%',
  },
  brandLogo: {
    width: 160,
    height: 'auto',
    objectFit: 'contain',
  },
  brandTagline: {
    fontSize: 7,
    color: BRAND.muted,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  receiptLabel: {
    fontSize: 22,
    fontWeight: 700,
    color: BRAND.dark,
    letterSpacing: -0.5,
    textAlign: 'right',
  },

  // Accent bar
  accentBar: {
    flexDirection: 'row',
    height: 3,
    marginBottom: 20,
  },
  accentPrimary: {
    flex: 1,
    backgroundColor: BRAND.primary,
  },
  accentSecondary: {
    flex: 1,
    backgroundColor: BRAND.secondary,
  },

  // Info columns
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 20,
  },
  infoBlock: {
    flex: 1,
  },
  infoBlockRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: 600,
    color: BRAND.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 9,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  infoValueBold: {
    fontSize: 9,
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },

  // Order meta row
  orderMetaRow: {
    flexDirection: 'row',
    backgroundColor: BRAND.accent,
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    gap: 20,
  },
  orderMetaItem: {
    flex: 1,
  },
  orderMetaLabel: {
    fontSize: 7,
    fontWeight: 600,
    color: BRAND.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  orderMetaValue: {
    fontSize: 10,
    fontWeight: 700,
    color: BRAND.dark,
  },

  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BRAND.dark,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: 700,
    color: BRAND.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    backgroundColor: BRAND.light,
  },
  colItem: { flex: 3 },
  colQty: { width: 40, textAlign: 'center' },
  colPrice: { width: 70, textAlign: 'right' },
  colTotal: { width: 80, textAlign: 'right' },
  cellText: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  cellTextBold: {
    fontSize: 9,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  cellTextMuted: {
    fontSize: 7.5,
    color: BRAND.muted,
    marginTop: 1,
  },

  // Totals
  totalsBlock: {
    alignSelf: 'flex-end',
    width: 220,
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: BRAND.muted,
  },
  totalValue: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  totalDivider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginVertical: 4,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: BRAND.primary,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: BRAND.white,
  },
  grandTotalValue: {
    fontSize: 11,
    fontWeight: 700,
    color: BRAND.white,
  },

  // Payment section
  paymentSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: BRAND.light,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BRAND.border,
  },
  paymentTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: BRAND.dark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  paymentLabel: {
    fontSize: 8,
    color: BRAND.muted,
  },
  paymentValue: {
    fontSize: 8,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  paymentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginTop: 6,
  },
  paymentBadgeText: {
    fontSize: 7,
    fontWeight: 700,
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
  },
  footerDivider: {
    flexDirection: 'row',
    height: 2,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 7,
    color: BRAND.muted,
    textAlign: 'center',
    lineHeight: 1.6,
  },
  footerBold: {
    fontSize: 7,
    fontWeight: 600,
    color: BRAND.dark,
    textAlign: 'center',
    marginBottom: 2,
  },
})

export { styles, BRAND }
