# Vending Machine

## Flowchart

```mermaid
flowchart TD
    start --> cash["현금결제 선택"]
    cash --> detectValidCash{"유효한 화폐인가?"}
    detectValidCash -- yes --> showPurchasableDrink["투입한 현금 내에서 구매 가능한 음료 표시"]
    detectValidCash -- no --> returnPreviousCash["직전 투입한 현금 반환"]
    returnPreviousCash --> hasCash{"이미 투입한 현금이 있는가?"}
    hasCash -- yes --> showPurchasableDrink
    hasCash -- no --> e["end"]
%% 
    showPurchasableDrink --> hasPurchasableDrink{"구매할 수 있는 음료가 있는가?"}
    hasPurchasableDrink -- yes --> hasWantedDrink{"구매하고 싶은 음료가 있는가?"}
    hasWantedDrink -- yes --> selectDrink["음료 선택"]
    hasWantedDrink -- no --> cancel["취소"]
    cancel --> alreadyHaveDrink{"이미 구매한 음료가 있는가?"}
    selectDrink --> hasStock{"실제 재고가 있는가?"}
    hasStock -- yes --> paymentMethod{"결제 방식이 무엇인가?"}
    hasStock -- no --> showStockError["재고가 없습니다 메시지 표시"]
    showStockError --> selectDrink
%% 
    paymentMethod -- 현금 --> deductDrinkPrice["음료 가격 차감"]
    deductDrinkPrice --> hasCashRemaining{"현금 잔액이 있는가?"}
    hasCashRemaining -- yes --> showPurchasableDrink
    hasPurchasableDrink -- no --> alreadyHaveDrink
    alreadyHaveDrink -- no --> cash
    alreadyHaveDrink -- yes --> returnAllCash
    hasCashRemaining -- no --> dispenseDrink["음료 제공"]
%% 
    start --> card["카드결제 선택"]
    card --> showAvailableDrink["구매할 수 있는 음료 표시"]
    showAvailableDrink --> selectDrink
    paymentMethod -- 카드 --> payment["카드 결제 요청"]
    payment --> isPaymentSuccess{"결제가 성공했는가?"}
    isPaymentSuccess -- yes --> dispenseDrink
    isPaymentSuccess -- no --> showPaymentError["카드 결제에 실패했습니다 메시지 표시"]
    showPaymentError --> selectDrink
    dispenseDrink --> isOutputSuccess{"음료가 정상적으로 제공되었는가?"}
    isOutputSuccess -- yes --> e
    isOutputSuccess -- no --> returnAllCash
    returnAllCash["투입한 현금 반환"] --> e
```

## 주요 기능

### 결제 시스템

- **현금 결제**:
    - 100원, 500원, 1000원, 5000원, 10000원 지원
    - 유효하지 않은 화폐 감지 및 반환
    - 자동 잔돈 계산 및 반환
    - 구매 불가능한 경우 전액 환불
- **카드 결제**:
    - 가상 카드 결제 시뮬레이션 (2초 지연)
    - 잔액 부족 시 결제 실패 처리
    - 결제 진행 상태 표시

### 음료 관리

- 음료별 개별 재고 관리 (콜라, 물, 커피)
- 실시간 재고 상태 표시
- 구매 가능/불가능 상태에 따른 시각적 피드백
- 재고 부족 시 에러 메시지 및 대체 음료 추천

### 디버그 모드

- **코나미 코드** (↑↑↓↓←→←→BA)로 활성화
- **시뮬레이션 옵션**:
    - 카드 결제 실패 강제
    - 상품 제공 실패 강제
    - 유효하지 않은 화폐 강제
    - 재고 불일치 강제
- 개발 및 테스트 시나리오 지원

## 기술 스택

### Core Technologies

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.1
- **Build Tool**: Vite
- **Code Quality**: ESLint

## 프로젝트 구조

```
src/
├── components/      # UI 컴포넌트
│   ├── features/    # 기능별 컴포넌트
│   ├── layouts/     # 레이아웃 컴포넌트
│   └── ui/          # 재사용 가능한 UI 컴포넌트
├── contexts/        # React Context 상태 관리
├── hooks/           # 커스텀 훅
├── services/        # 비즈니스 로직
├── strategies/      # Strategy 패턴 구현
└── types/           # TypeScript 타입 정의
```

## 설치 및 실행

### 사전 요구사항

- Node.js 20+
- pnpm 10+

### 설치 및 실행 단계

```bash
pnpm install --frozen-lockfile

# 개발 서버 실행 (http://localhost:5173)
pnpm run dev
```

### 개발 환경

- 개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다
- 변경사항은 실시간으로 반영됩니다 (Hot Module Replacement)
- 디버그 모드는 코나미 코드로 활성화할 수 있습니다

## 🏗 아키텍처

### Strategy Pattern (전략 패턴)

결제 방식에 따른 다양한 처리 로직을 캡슐화하여 확장성과 유지보수성을 확보했습니다.

**장점:**

- 새로운 결제 방식 추가 시 기존 코드 수정 없이 확장 가능
- 각 결제 방식의 로직이 독립적으로 관리됨
- 테스트 및 디버깅이 용이함

### Context-based State Management (상태 관리)

React Context API를 활용하여 전역 상태를 효율적으로 관리합니다.

**장점:**

- Props drilling 방지
- 관심사별로 상태 분리 관리
- 불필요한 리렌더링 최소화

## 사용법

### 기본 사용법

1. **결제 방식 선택**: 상단의 버튼으로 현금/카드 결제 선택
2. **현금 결제 시**:
    - 하단의 동전 버튼으로 현금 투입
    - 투입 금액이 표시되면서 구매 가능한 음료가 활성화
3. **카드 결제 시**:
    - 바로 음료 선택 가능
    - 결제 진행 과정이 표시됨
4. **음료 선택**: 원하는 음료 버튼 클릭
5. **완료**: 음료가 하단 배출구에 표시

### 디버그 모드 활성화

- **코나미 코드** 입력: ↑↑↓↓←→←→BA
- 우측 하단에 관리자 패널이 나타남
- 각종 에러 상황을 시뮬레이션할 수 있음

### 주요 기능 설명

- **잔돈 자동 계산**: 현금 결제 시 자동으로 잔돈을 계산하여 표시
- **재고 관리**: 음료 구매 시 재고가 감소하며, 재고가 없으면 구매 불가
- **에러 처리**: 결제 실패, 재고 부족 등 다양한 상황에 대한 적절한 안내
- **취소/환불**: 언제든지 취소 버튼으로 투입한 현금 환불 가능

## 테스트 시나리오

### 일반 시나리오

1. **정상 현금 결제**
    - 1000원 투입 → 600원 음료 선택 → 400원 잔돈 확인
2. **정상 카드 결제**
    - 카드 모드 선택 → 음료 선택 → 결제 진행 확인
3. **재고 부족**
    - 재고가 0인 음료 선택 시 에러 메시지 확인

### 디버그 모드 시나리오

1. **카드 결제 실패**: 디버그 옵션 활성화 후 카드 결제 시 실패 시뮬레이션
2. **상품 제공 실패**: 정상 결제 후 상품 제공 단계에서 실패 시뮬레이션
3. **유효하지 않은 화폐**: 현금 투입 시 무효 처리 시뮬레이션
4. **재고 불일치**: 시스템 재고와 실제 재고 불일치 시뮬레이션
