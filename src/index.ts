// CryptoJS 모듈을 TypeScript에서 사용하기 위해 모듈 전체를 가져오기
import * as CryptoJS from "crypto-js";

// Block 클래스 정의: TypeScript의 클래스와 접근 제어자(public) 사용
class Block {
  // 클래스 속성에 타입을 명시적으로 선언
  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public data: string;

  // 정적 메소드: 클래스 레벨에서 해시 계산 함수 제공
  // 함수의 반환 타입을 명시적으로 선언하여 TypeScript의 타입 안정성 활용
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + data + timestamp).toString();

  // 정적 메소드: 블록 구조 유효성 검사
  // 입력된 블록의 타입 구조를 검사하여 블록의 유효성 확인
  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  // 생성자: TypeScript에서 생성자를 통해 객체의 초기 상태 설정
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

// 제네시스 블록 초기화: 객체 생성 시 타입 체크 강화
const genesisBlock: Block = new Block(0, "20242024", "", "hello", 123456);

// 블록체인 배열: TypeScript에서 배열 타입 명시적 선언
let blockchain: Block[] = [genesisBlock];

// 함수 반환 타입 명시: 블록체인 배열 반환
const getBlockchain = (): Block[] => blockchain;

// 최신 블록 반환: 함수의 반환 타입을 Block으로 명시
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

// 현재 시간의 타임스탬프를 초 단위로 반환: 함수 반환 타입 명시
const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

// 새 블록 생성 함수: 함수의 반환 타입을 Block으로 명시
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimestamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

// 블록 해시 계산: 타입 체크를 통한 데이터 무결성 보장
const getHashForBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

// 블록 유효성 검사: 로직의 타입 안정성 강화
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

// 새 블록을 블록체인에 추가: 타입 안정성을 통한 오류 최소화
const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

// 새 블록을 생성하고 체인에 추가: 프로세스의 타입 안정성 확인
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

// 블록체인의 상태 출력: 개발자 도구에서 상태 확인 용이
console.log(blockchain);

// 모듈로서의 파일 선언: export 문을 통해 모듈 기능 확정
export {};
