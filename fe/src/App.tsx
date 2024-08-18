import classNames from "classnames"

import { BackspaceIcon } from "@heroicons/react/24/solid"

function QuestionArea() {
  return (
    <div className="flex flex-col items-center justify-end bg-blue-800 text-gray-900">
      <div
        className={classNames(
          "flex items-center justify-center",
          "nunito-800 bg-blue-900 text-5xl text-blue-200",
          "rounded-t-xl",
          "portrait:h-48 portrait:w-[20rem]",
          "landscape:h-24 landscape:w-[40rem]",
        )}
      >
        5 x 4 = ?
      </div>
    </div>
  )
}

function KeyboardButton({
  value,
  onClick,
}: {
  value: string
  onClick: (value: string) => void
}) {
  return (
    <div
      className={classNames(
        "mask mask-squircle flex aspect-square items-center justify-center",
        "nunito-800 bg-rose-500 text-6xl text-white",
      )}
      onClick={() => onClick(value)}
    >
      {value}
    </div>
  )
}

function Keyboard() {
  const clicked = (value: string) => {
    console.log(`Clicked ${value}`)
  }
  return (
    <div className="flex flex-col items-center justify-start bg-blue-800">
      <div
        className={classNames(
          "m-4 mt-0 w-80 rounded-b-xl bg-blue-950 p-4",
          "portrait:w-[20rem]",
          "landscape:w-[40rem]",
          "grid place-items-stretch gap-2 portrait:grid-cols-3 landscape:grid-cols-6",
        )}
      >
        <KeyboardButton value={"1"} onClick={clicked} />
        <KeyboardButton value={"2"} onClick={clicked} />
        <KeyboardButton value={"3"} onClick={clicked} />
        <KeyboardButton value={"4"} onClick={clicked} />
        <KeyboardButton value={"5"} onClick={clicked} />
        <div className="portrait:hidden" />
        <KeyboardButton value={"6"} onClick={clicked} />
        <KeyboardButton value={"7"} onClick={clicked} />
        <KeyboardButton value={"8"} onClick={clicked} />
        <KeyboardButton value={"9"} onClick={clicked} />
        <div className="landscape:hidden" />
        <KeyboardButton value={"0"} onClick={clicked} />
        <BackspaceIcon className="text-rose-500" />
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <div className="absolute inset-x-0 top-4 flex flex-col items-center">
        <div className="badge bg-blue-950 p-4 text-white">Level 1</div>
      </div>
      <QuestionArea />
      <Keyboard />
      <div className="flex">
        <div className="avatar">
          <div className="w-24 rounded-full object-scale-down">
            <img src="g/01.png" alt="avatar" />
          </div>
        </div>
        {/* <div className="avatar"> */}
        <div className="w-24 rounded bg-clip-border">
          <img
            className="size-24 object-contain"
            width="20px"
            height={20}
            src="g/02.png"
            alt="avatar"
          />
        </div>
      </div>
      {/* </div> */}
    </>
  )
}

export default App
