import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';
import github from '../../services/github';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
};

const Home: React.FC = () => {
    const [newRepository, setNewRepository] = useState('');
    const [inputError, setInputError] = useState('');

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storedRepositories = localStorage.getItem('@github-explorer:repositories');

        if (storedRepositories) {
            return JSON.parse(storedRepositories);
        }

        return [];
    });

    useEffect(() => {
        localStorage.setItem('@github-explorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!newRepository) {
            setInputError('Enter the repository author/name');
            return;
        }

        try {
            const { data } = await github.get<Repository>(`repos/${newRepository}`);

            setRepositories([data, ...repositories]);
            setNewRepository('');
            setInputError('');
        } catch (error) {
            setInputError('Repository not found');
        }
    }

    return (
        <>
            <img src={logoImg} alt="GitHub Explorer" />
            <Title>Explore GitHub Repositories</Title>

            <Form onSubmit={handleAddRepository} hasError={!!inputError}>
                <input
                    value={newRepository}
                    onChange={({ target }) => setNewRepository(target.value)}
                    placeholder="Enter the repository name"
                />
                <button type="submit">Search</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Home;
