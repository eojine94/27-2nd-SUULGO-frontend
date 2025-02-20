import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SingleQuestion from './Question/SingleQuestion';
import PluralQuestion from './Question/PluralQuestion';
import FreeQuestion from './Question/FreeQuestion';
import Description from './Description';
import NumberQuestion from './Question/NumberQuestion';
import SURVEY_DATA from '../data/surveyData';
import API from '../../config';

function Survey() {
  const [currentPage, setCurrentPage] = useState(0);
  const [numberValue, setNumberValue] = useState({ class_number: '' });
  const [singleValue, setSingleValue] = useState({
    stack: '',
    mbti: '',
    alcohol_limit: '',
    alcohol_level: '',
  });
  const [pluralValue, setPluralValue] = useState({
    alcohol_category: [],
    flavor: [],
    drinking_method: [],
  });
  const [freeValue, setFreeValue] = useState({
    hobby: '',
    favorite_place: '',
    favorite_food: '',
    comment: '',
  });

  const navigate = useNavigate();
  const backToPage = () => setCurrentPage(prevCount => prevCount - 1);
  const goToPage = () => setCurrentPage(prevCount => prevCount + 1);

  const completedPercent = Math.ceil(
    (currentPage / (SURVEY_DATA.length - 1)) * 100
  );

  const surveyCategory = SURVEY_DATA[currentPage].category;

  const currentServey = {
    single: (
      <SingleQuestion
        surveyLists={SURVEY_DATA[currentPage]}
        singleValue={singleValue}
        setSingleValue={setSingleValue}
        surveyCategory={surveyCategory}
      />
    ),
    plural: (
      <PluralQuestion
        surveyLists={SURVEY_DATA[currentPage].answer}
        pluralValue={pluralValue}
        setPluralValue={setPluralValue}
        surveyCategory={surveyCategory}
      />
    ),
    free: (
      <FreeQuestion
        surveyLists={SURVEY_DATA[currentPage].answer}
        freeValue={freeValue}
        setFreeValue={setFreeValue}
      />
    ),
    number: (
      <NumberQuestion
        surveyLists={SURVEY_DATA[currentPage].answer}
        setNumberValue={setNumberValue}
      />
    ),
  };

  const isFreeValue =
    !!freeValue.hobby &&
    !!freeValue.favorite_place &&
    !!freeValue.favorite_food &&
    !!freeValue.comment;

  const optionWarning = {
    single: (
      <WarnnigMessage>
        {!singleValue[surveyCategory] && `옵션을 선택해주세요`}
      </WarnnigMessage>
    ),
    plural: (
      <WarnnigMessage>
        {!(
          pluralValue[surveyCategory] && !!pluralValue[surveyCategory].length
        ) && `옵션을 선택해주세요`}
      </WarnnigMessage>
    ),
    free: (
      <WarnnigMessage>{!isFreeValue && `옵션을 선택해주세요`}</WarnnigMessage>
    ),
    number: (
      <WarnnigMessage>
        {!numberValue[surveyCategory] && `옵션을 선택해주세요`}
      </WarnnigMessage>
    ),
  };

  const submitSurvey = () => {
    if (!!localStorage.getItem('token')) {
      fetch(API.survey, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          class_number: numberValue.class_number,
          gender: singleValue.gender,
          stack: singleValue.stack,
          mbti: singleValue.mbti,
          alcohol_category: pluralValue.alcohol_category,
          alcohol_level: singleValue.alcohol_level,
          alcohol_limit: singleValue.alcohol_limit,
          flavor: pluralValue.flavor,
          drinking_method: pluralValue.drinking_method,
          hobby: freeValue.hobby,
          favorite_place: freeValue.favorite_place,
          favorite_food: freeValue.favorite_food,
          comment: freeValue.comment,
        }),
      })
        .then(response => response.json())
        .then(res => {
          switch (res.message) {
            case 'SUCCESS':
              alert('술고에 오신걸 환영합니다!!!!');
              navigate('/');
              break;
            case 'KEY_ERROR':
              alert('입력되지 않은 항목을 입력후 제출해 주세요!');
              break;
            case 'ALREDY_EXISTS':
              alert('이미 정보가 입력되어 있습니다. 술고를 즐겨주세요^^');
              break;
            default:
              break;
          }
        });
    } else {
      alert('로그인해주세요^^');
    }
  };

  return (
    <Section>
      <Thumbnail src="/images/surveyimg.png" />
      <Main>
        <SurveyWrap onSubmit={e => e.preventDefault()}>
          <Introduce>설문조사 완료까지 얼마나 남았을까요?</Introduce>
          <IndicateBox>
            <Indicate>
              <ColorIndicate width={`${completedPercent}%`} />
            </Indicate>
            <IndicateNumber>{completedPercent}%</IndicateNumber>
          </IndicateBox>
          <SurveyTitle>{SURVEY_DATA[currentPage].question}</SurveyTitle>
          {currentServey[SURVEY_DATA[currentPage].type]}
          <ButtonWrap>
            {optionWarning[SURVEY_DATA[currentPage].type]}
            <ButtonBox>
              {currentPage !== 0 && <Button onClick={backToPage}>이전</Button>}
              {currentPage !== SURVEY_DATA.length - 1 ? (
                <NextButton
                  onClick={goToPage}
                  disabled={
                    !(
                      !!singleValue[surveyCategory] ||
                      !!numberValue[surveyCategory] ||
                      (pluralValue[surveyCategory] &&
                        !!pluralValue[surveyCategory].length)
                    )
                  }
                >
                  다음
                </NextButton>
              ) : (
                <NextButton onClick={submitSurvey} disabled={!isFreeValue}>
                  제출하기
                </NextButton>
              )}
            </ButtonBox>
          </ButtonWrap>
        </SurveyWrap>
        <Description />
      </Main>
    </Section>
  );
}

export default Survey;

const Section = styled.section`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.grey};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Main = styled.section`
  margin-top: -50px;
  ${({ theme }) => theme.flexSet('center', 'start')}
`;

const SurveyWrap = styled.form`
  padding: 40px;
  margin-bottom: 40px;
  width: 560px;
  background-color: ${({ theme }) => theme.white};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borderGrey};
  font-size: 24px;
`;

const Introduce = styled.p`
  margin: 5px 0;
  color: ${({ theme }) => theme.deepGrey};
  font-size: 12px;
`;

const IndicateBox = styled.div`
  ${({ theme }) => theme.flexSet('space-between')}
`;

const Indicate = styled.div`
  position: relative;
  width: 88%;
  height: 4px;
  background-color: ${({ theme }) => theme.grey};
  border-radius: 5px;
`;

const ColorIndicate = styled.div`
  position: absolute;
  top: 50;
  width: ${props => props.width};
  height: 4px;
  background-color: ${({ theme }) => theme.mint};
  border-radius: 5px;
  transition: all 0.5s;
`;

const IndicateNumber = styled.p`
  display: inline;
  color: ${({ theme }) => theme.mint};
  font-size: 16px;
  font-weight: 600;
`;

const SurveyTitle = styled.h1`
  padding: 30px 0;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.black};
  font-size: 24px;
`;

const ButtonWrap = styled.div`
  ${({ theme }) => theme.flexSet('space-between')}
`;

const WarnnigMessage = styled.span`
  color: red;
  text-align: left;
  font-size: 12px;
`;

const ButtonBox = styled.div`
  ${({ theme }) => theme.flexSet('center')}
`;

const Button = styled.button`
  margin: 20px 0 20px 20px;
  padding: 10px;
  width: 100px;
  border-radius: 5px;
  color: ${({ theme }) => theme.mint};
  border: 1px solid ${({ theme }) => theme.borderGrey};
  background-color: ${({ theme }) => theme.white};
  font-size: 16px;
  cursor: pointer;
`;

const NextButton = styled(Button)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.mint};
  border: ${({ theme }) => theme.mint};
`;
