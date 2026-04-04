import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch, fetchFact } from '../store';
import { Loader, ErrorMsg } from '../components/SharedUI';

export const FactsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.app.fact);

    useEffect(() => {
        if (!data) dispatch(fetchFact());
    }, [dispatch, data]);

    return (
        <section className="content-section active">
            <h2>Случайный факт о котах</h2>
            <div className="controls">
                <button className="action-btn" onClick={() => dispatch(fetchFact())} disabled={loading}>
                    Получить новый факт (GET)
                </button>
            </div>
            
            <Loader visible={loading} />
            <ErrorMsg message={error} />
            
            {!loading && data && (
                <article className="fact-card">
                    <p style={{ opacity: 1 }}>{data.fact}</p>
                </article>
            )}
        </section>
    );
};