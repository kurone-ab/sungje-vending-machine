import { useCallback, useEffect, useState } from "react";

interface Drink {
  id: number;
  name: string;
  price: number;
  stock: number;
  icon: string;
}

type PaymentMethod = "cash" | "card";

const initialDrinks: Drink[] = [
  { id: 1, name: "콜라", price: 1100, stock: 5, icon: "🥤" },
  { id: 2, name: "물", price: 600, stock: 10, icon: "💧" },
  { id: 3, name: "커피", price: 700, stock: 8, icon: "☕️" },
];

const cashTypes = [100, 500, 1000, 5000, 10000];


function App() {
  const [drinks, setDrinks] = useState(initialDrinks);
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<Drink[]>([]);
  const [message, setMessage] = useState("결제 방식을 선택해주세요.");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);

  // 메시지를 잠시 보여주고 초기화하는 함수
  const showTemporaryMessage = useCallback(
    (msg: string, duration = 2000) => {
      const defaultMessage =
        paymentMethod === "cash" ? "현금을 투입하거나 음료를 선택하세요." : "결제할 음료를 선택하세요.";
      setMessage(msg);
      setTimeout(() => {
        setMessage(defaultMessage);
      }, duration);
    },
    [paymentMethod],
  );

  // 자동 잔돈 반환 로직
  useEffect(() => {
    // 조건: 잔액이 있고, 구매한 상품이 있으며, 더 이상 구매 가능한 상품이 없을 때
    if (insertedMoney > 0 && purchasedItems.length > 0) {
      const canBuyMore = drinks.some((drink) => drink.stock > 0 && insertedMoney >= drink.price);
      if (!canBuyMore) {
        // 딜레이를 주어 사용자가 상황을 인지할 시간을 줌
        showTemporaryMessage(`구매 가능한 상품이 없어 ${insertedMoney.toLocaleString()}원을 반환합니다.`, 4000);
        setInsertedMoney(0);
      }
    }
  }, [purchasedItems, drinks, showTemporaryMessage]);

  // 현금 투입 핸들러
  const handleInsertCash = (amount: number) => {
    if (paymentMethod !== "cash" || purchasedItems.length > 0) return;
    setInsertedMoney((prev) => prev + amount);
    showTemporaryMessage(`${amount.toLocaleString()}원이 투입되었습니다.`);
  };

  // 음료 선택 핸들러
  const handleSelectDrink = (drink: Drink) => {
    if (isProcessing) return;

    if (drink.stock <= 0) {
      showTemporaryMessage("재고가 없습니다.");
      return;
    }

    if (paymentMethod === "cash") {
      if (insertedMoney < drink.price) {
        showTemporaryMessage("잔액이 부족합니다.");
        return;
      }
      // 현금 구매 처리
      setInsertedMoney((prev) => prev - drink.price);
      dispenseDrink(drink);
    } else {
      // 카드 결제 처리
      processCardPayment(drink);
    }
  };

  // 카드 결제 시뮬레이션
  const processCardPayment = (drink: Drink) => {
    setIsProcessing(true);
    setMessage(`${drink.name} 카드 결제 중...`);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% 확률로 성공
      if (isSuccess) {
        dispenseDrink(drink);
      } else {
        showTemporaryMessage("카드 결제에 실패했습니다.");
      }
      setIsProcessing(false);
    }, 2000);
  };

  // 음료 제공 로직
  const dispenseDrink = (drink: Drink) => {
    setPurchasedItems((prev) => [...prev, { ...drink, id: Date.now() }]);
    setDrinks((prevDrinks) => prevDrinks.map((d) => (d.id === drink.id ? { ...d, stock: d.stock - 1 } : d)));
    showTemporaryMessage(`${drink.name}이(가) 나왔습니다.`);
  };

  // 잔돈 반환 핸들러
  const handleReturnChange = () => {
    if (insertedMoney > 0) {
      showTemporaryMessage(`거스름돈 ${insertedMoney.toLocaleString()}원이 반환됩니다.`);
      setInsertedMoney(0);
    } else {
      showTemporaryMessage("반환할 금액이 없습니다.");
    }
  };

  // 결제 모드 변경
  const togglePaymentMode = () => {
    setPaymentMethod((prev) => (prev === "cash" ? "card" : "cash"));
    setMessage(paymentMethod === "card" ? "현금 결제로 전환되었습니다." : "카드 결제로 전환되었습니다.");
  };

  // 자판기 초기화 함수
  const handleReset = () => {
    setDrinks(initialDrinks);
    setInsertedMoney(0);
    setPurchasedItems([]);
    setPaymentMethod("cash");
    setIsProcessing(false);
    setMessage("결제 방식을 선택해주세요.");
    showTemporaryMessage("자판기가 초기화되었습니다.");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-500/50 rounded-2xl shadow-2xl p-8 w-[800px] h-auto grid grid-cols-3 gap-8">
        {/* 1. 음료 진열대 */}
        <div className="col-span-2 bg-black/30 rounded-lg p-6 grid grid-cols-3 grid-rows-2 gap-6">
          {drinks.map((drink) => {
            const isCashAvailable = paymentMethod === "cash" && insertedMoney >= drink.price && drink.stock > 0;
            const isCardAvailable = paymentMethod === "card" && drink.stock > 0;
            const isAvailable = isCashAvailable || isCardAvailable;

            return (
              <button
                key={drink.id}
                onClick={() => handleSelectDrink(drink)}
                disabled={!isAvailable || isProcessing}
                className={`bg-white/90 p-4 rounded-lg shadow-lg flex flex-col items-center justify-between transition-all duration-200 \
                  ${isAvailable && !isProcessing ? "cursor-pointer hover:scale-105 hover:shadow-xl" : "opacity-50 cursor-not-allowed"}`}
              >
                <div className="text-5xl mb-2">{drink.icon}</div>
                <div className="font-bold text-lg">{drink.name}</div>
                <div className="text-md text-gray-800">₩{drink.price.toLocaleString()}</div>
                <div
                  className={`text-xs font-semibold mt-2 px-2 py-1 rounded-full ${drink.stock > 0 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                >
                  재고: {drink.stock}
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. 컨트롤 패널 */}
        <div className="flex flex-col gap-6">
          {/* 상태 표시창 */}
          <div className="bg-black text-white p-4 rounded-md text-right shadow-inner-lg">
            <div className="text-sm text-green-400">{paymentMethod === "card" ? "💳 카드결제" : "💵 현금결제"}</div>
            <div className="text-3xl font-mono my-1">₩{insertedMoney.toLocaleString()}</div>
            <div className="text-sm mt-1 h-10 text-yellow-300 break-keep">{message}</div>
          </div>

          {/* 현금/카드 전환 버튼 */}
          <button
            onClick={togglePaymentMode}
            disabled={insertedMoney > 0} // 현금 투입 시 비활성화
            className="cursor-pointer w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {paymentMethod === "cash" ? "💳 카드 결제로 전환" : "💵 현금 결제로 전환"}
          </button>

          {/* 현금 투입 */}
          <div>
            <p className={`text-white text-sm mb-2 transition-opacity ${paymentMethod !== "cash" && "opacity-50"}`}>
              현금 투입:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cashTypes.map((cash) => (
                <button
                  key={cash}
                  onClick={() => handleInsertCash(cash)}
                  disabled={paymentMethod !== "cash" || isProcessing || purchasedItems.length > 0}
                  className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {cash.toLocaleString()}원
                </button>
              ))}
            </div>
          </div>

          {/* 반환 버튼 */}
          <div>
            <button
              onClick={handleReturnChange}
              disabled={paymentMethod !== "cash" || isProcessing}
              className="cursor-pointer w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              반환
            </button>
          </div>
        </div>

        {/* 3. 반환구 */}
        <div className="col-span-3 bg-black/30 rounded-lg p-4 min-h-[100px] flex items-center justify-between shadow-inner-lg">
          <div className="flex items-center gap-4">
            <div className="font-bold text-white">반환구:</div>
            <div className="flex gap-2 flex-wrap">
              {purchasedItems.length > 0 ? (
                purchasedItems.map((item) => (
                  <div key={item.id} className="text-4xl">
                    {item.icon}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">구매한 상품이 없습니다.</div>
              )}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors font-semibold"
          >
            🔄 초기화
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
