import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { getProfileFaqQuestions, getProfileAnsweredQuestions, getProfileAskedQuestions, getProfileQuestionCount, reset } from '../../features/question/questionSlice';
import { QuestionCard, Navbar } from '../';
import { faqIcon, answeredIcon, askedIcon } from '../../constance/icons';
import './styles/Questions.css';


const Questions = () => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const location = useLocation().pathname.split('/')[2];
    const { faq, answered, asked, count, isLoading } = useSelector(state => state.question);


    useEffect(() => {

        if(!location) {
            dispatch(getProfileFaqQuestions(username));
        } else if (location === 'answered') {
            dispatch(getProfileAnsweredQuestions(username));
        } else if (location === 'aksed') {
            dispatch(getProfileAskedQuestions(username));
        }
    }, [location]);


    useEffect(() => {
        dispatch(getProfileQuestionCount(username));

        return () => {
            dispatch(reset());
        }
    }, []);

    return (
        <section className="container">
            <Navbar
                links={
                    [
                        {
                            name: 'FAQ',
                            icon: faqIcon,
                            path: `/${username}`,
                            count: count?.faq,
                        },
                        {
                            name: 'Answered',
                            icon: answeredIcon,
                            path: `/${username}/answered`,
                            count: count?.answered,
                        },
                        {
                            name: 'Asked',
                            icon: askedIcon,
                            path: `/${username}/asked`,
                            count: count?.asked,
                        }
                    ]
                }
            />
            <div className="questions">
                {location === 'answered' ? (
                    <>
                        {answered.map((question, index) => (
                            <QuestionCard key={`answered-${question._id+index}`} question={question} />
                        ))}
                        {!isLoading && answered.length === 0 && (
                            <p className="title-3">
                                {username.slice(0,1).toUpperCase()+username.slice(1)} has not answered any questions yet.
                            </p>
                        )}
                        {isLoading && answered.length === 0 && <QuestionCard isLoading={isLoading}/>}
                    </>
                ) : !location ? (
                    <>
                        {faq.map((question, index) => (
                            <QuestionCard key={`faq-${question._id+index}`} question={question} />
                        ))}
                        {!isLoading && faq.length === 0 && (
                            <p className="title-3">
                                {username.slice(0,1).toUpperCase()+username.slice(1)} has not posted any FAQ yet.
                            </p>
                        )}
                        {isLoading && faq.length === 0 && <QuestionCard isLoading={isLoading}/>}
                    </>
                ) : location === 'asked' && (
                    <>
                        {asked.map((question, index) => (
                            <QuestionCard key={`asked-${question._id+index}`} question={question} />
                        ))}
                        {!isLoading && asked.length === 0 && (
                            <p className="title-3">
                                {username.slice(0,1).toUpperCase()+username.slice(1)} has not asked any questions yet.
                            </p>
                        )}
                        {isLoading && asked.length === 0 && <QuestionCard isLoading={isLoading}/>}
                    </>
                )}
            </div>
        </section>
    )
}

export default Questions