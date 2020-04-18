import format from 'date-fns/format'

export default function BlogDate({ date }) {
  const formattedDate = format(new Date(date), 'dd MMMM yyyy')

  return (
    <time dateTime={date}>
      {formattedDate}
    </time>
  )
}
