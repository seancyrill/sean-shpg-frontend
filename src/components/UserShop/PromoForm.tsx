import { useEffect, useRef, useState } from "react"
import ItemBubble from "../ItemBubble"
import DeletePromo from "./DeletePromo"
import { useParams } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext"
import { useShopContext } from "../../pages/UserControls/UserShop"
import { timeStampToLocal } from "../../utilities/timeStampToLocal"
import { isAxiosError } from "axios"
import SuccessModal from "./SuccessModal"

export type PromoInputType = {
  discount: number
  start_date: string
  start_time: string
  end_date: string
  end_time: string
}

type PromoFormType = {
  backToShop: () => void
}

function PromoForm({ backToShop }: PromoFormType) {
  const { id } = useParams()
  const { privateReq, shop_id, setFetchErrModal } = useAuthContext()
  const { shopItems, setShopLoading } = useShopContext()

  const item_info = shopItems.find((item) => item.item_id === +id!)!
  const { item_id, item_name, discount: dsc, start_date: sd, end_date: ed } = item_info

  const [creatingNew, setCreatingNew] = useState(!dsc)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const { localDate: localStartDate, localTime: localStartTime } = timeStampToLocal(sd!)
  const { localDate: localEndDate, localTime: localEndTime } = timeStampToLocal(ed!)
  const emptyInput = {
    discount: 0,
    start_date: "",
    start_time: "06:00",
    end_date: "",
    end_time: "18:00",
    promo_group_id: null,
  }
  const initInput = {
    discount: dsc!,
    start_date: localStartDate,
    start_time: localStartTime,
    end_date: localEndDate,
    end_time: localEndTime,
    promo_group_id: null,
  }

  const [input, setInput] = useState<PromoInputType>(dsc ? initInput : emptyInput)
  const { discount, end_date, end_time, start_date, start_time } = input

  async function handleSubmit() {
    const newPromoInput = {
      ...input,
      start_date: new Date(`${start_date}T${start_time}`).toISOString(),
      end_date: new Date(`${end_date}T${end_time}`).toISOString(),
      item_id,
      shop_id,
    }

    setShopLoading(true)
    try {
      await privateReq.post("/promo", newPromoInput)
      setShowModal(true)
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return
        console.error(error.response?.data)
        return setError(error.response?.data?.message)
      } else {
        console.error(error)
      }
      setFetchErrModal(true)
    } finally {
      setShopLoading(false)
    }
  }

  function onDelete() {
    setInput(emptyInput)
    setCreatingNew(true)
  }

  //for handling price input and display
  //const discountDisplay =
  //  discount.toLocaleString() === "0" ? "" : discount.toLocaleString();

  const [discountString, setdiscountString] = useState(discount ? `${discount}` : "")
  function discountStringChange(val: string) {
    //const pattern = /^[\d]{0,2}(\.[\d]{0,2})?$/;
    const pattern = /^[\d]{0,2}?$/
    if (pattern.test(val)) {
      setdiscountString(val)
      setInput({
        ...input,
        discount: +val,
      })
    }
  }

  const itemBubbleDisplay = {
    ...item_info,
    discount: input.discount,
    start_date: new Date().toISOString(),
    end_date: new Date(`${new Date().getFullYear() + 1}`).toISOString(),
  }
  const autoFocus = useRef<HTMLInputElement>(null)
  useEffect(() => {
    autoFocus.current?.focus()
  }, [])

  return (
    <div className="flex flex-1 flex-col-reverse border-y md:flex-row">
      <form
        onSubmit={(e) => (e.preventDefault(), handleSubmit())}
        className="flex flex-col gap-4 border-r p-6"
      >
        {error !== null && <p>{error}</p>}
        {creatingNew ? (
          <h2>Fill all the input below</h2>
        ) : (
          <h2 className="bg-Pale-orange p-1 text-center text-sm text-Orange">
            Editing item promotion
          </h2>
        )}

        <label className="off-screen">Name</label>
        <input
          required
          type="text"
          value={discountString}
          placeholder="Discount Amount"
          className={`input-field`}
          onChange={(e) => discountStringChange(e.target.value)}
        />

        <div className="flex flex-col">
          <label>Starts:</label>
          <fieldset className="flex gap-1">
            <label className="off-screen">Start-Date</label>
            <input
              required
              type="date"
              //min={today}
              value={start_date}
              onChange={(e) => setInput({ ...input, start_date: e.target.value })}
              className="input-field flex-1"
            />
            <label className="off-screen">Start-Time</label>
            <input
              required
              type="time"
              value={start_time}
              onChange={(e) => setInput({ ...input, start_time: e.target.value })}
              className="input-field"
            />
          </fieldset>
        </div>

        <div className="flex flex-col">
          <label>Ends:</label>
          <fieldset className="flex gap-1">
            <label className="off-screen">End-Date</label>
            <input
              required
              type="date"
              min={start_date}
              value={end_date}
              onChange={(e) => setInput({ ...input, end_date: e.target.value })}
              className="input-field flex-1"
            />
            <label className="off-screen">End-Time</label>
            <input
              required
              type="time"
              value={end_time}
              onChange={(e) => setInput({ ...input, end_time: e.target.value })}
              className="input-field"
            />
          </fieldset>
        </div>

        {!creatingNew && <DeletePromo item={item_info} onDelete={onDelete} />}
        <button type="submit" className="primary-button w-full">
          Submit
        </button>
      </form>

      <div className="w-full bg-Light-grayish-blue p-4">
        <ItemBubble item={itemBubbleDisplay} />
      </div>

      <SuccessModal
        successMessage={`You have successfully added a promotion for your item, ${item_name}!`}
        newLink={`/item/${item_id}`}
        showConfirmation={showModal}
        backToShop={backToShop}
      />
    </div>
  )
}

export default PromoForm
