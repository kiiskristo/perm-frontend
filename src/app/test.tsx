"use client"

export default function Test() {
  return (
    <div className="p-4">
      <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
        This should be a red box with white text
      </div>
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
        This should be a blue box with white text
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500 p-4 rounded-lg">1</div>
        <div className="bg-yellow-500 p-4 rounded-lg">2</div>
        <div className="bg-purple-500 p-4 rounded-lg">3</div>
      </div>
    </div>
  )
} 