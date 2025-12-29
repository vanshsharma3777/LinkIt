import React from "react"

interface HighlightTextProps {
  text: string
  query: string
}

export  function HighlightText({
  text,
  query,
}: HighlightTextProps) {
  if (!query) return <>{text}</>

  const regex = new RegExp(`(${query})`, "gi")

  return (
    <>
      {text.split(regex).map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-400 text-white px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}
