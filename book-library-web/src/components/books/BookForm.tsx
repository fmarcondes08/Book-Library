import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Book } from '../../interfaces/book.interface';
import { useNavigate } from 'react-router-dom';

interface BookFormProps {
  initialValues: Book;
  onSubmit: (values: Book) => Promise<void>;
  isEditing: boolean;
}

const BookSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  firstName: Yup.string().required('Author first name is required'),
  lastName: Yup.string().required('Author last name is required'),
  totalCopies: Yup.number()
    .required('Total copies is required')
    .min(1, 'Must have at least 1 copy'),
  copiesInUse: Yup.number()
    .required('Copies in use is required')
    .min(0, 'Cannot be negative')
    .test(
      'less-than-total',
      'Copies in use cannot exceed total copies',
      function (value) {
        return value <= this.parent.totalCopies;
      }
    ),
  type: Yup.string().required('Type is required'),
  isbn: Yup.string().required('ISBN is required'),
  category: Yup.string().required('Category is required'),
});

const BookForm: React.FC<BookFormProps> = ({ initialValues, onSubmit, isEditing }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '2rem',
      }}
    >
      <h2>{isEditing ? 'Edit Book' : 'Add New Book'}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={BookSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            await onSubmit(values);
            navigate('/');
          } catch (error) {
            setStatus(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '600px',
              width: '100%',
            }}
          >
            {status && (
              <div style={{ color: 'red' }}>
                {status instanceof Error ? status.message : String(status)}
              </div>
            )}

            {[
              { label: 'Title', name: 'title', type: 'text' },
              { label: 'ISBN', name: 'isbn', type: 'text' },
              { label: 'Author First Name', name: 'firstName', type: 'text' },
              { label: 'Author Last Name', name: 'lastName', type: 'text' },
              { label: 'Total Copies', name: 'totalCopies', type: 'number', min: 1 },
              { label: 'Copies In Use', name: 'copiesInUse', type: 'number', min: 0 },
            ].map(({ label, name, type, min }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={name}>{label}</label>
                <Field type={type} id={name} name={name} min={min} />
                <ErrorMessage
                  name="title"
                  render={msg => <div style={{ color: 'red' }}>{msg}</div>}
                />
              </div>
            ))}

            {[
              {
                label: 'Category',
                name: 'category',
                options: [
                  '',
                  'Fiction',
                  'Non-Fiction',
                  'Biography',
                  'Mystery',
                  'Sci-Fi',
                  'History',
                ],
              },
              {
                label: 'Type',
                name: 'type',
                options: ['', 'Hardcover', 'Paperback', 'E-Book', 'Audiobook'],
              },
            ].map(({ label, name, options }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={name}>{label}</label>
                <Field as="select" id={name} name={name}>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt || `Select a ${label.toLowerCase()}`}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="title"
                  render={msg => <div style={{ color: 'red' }}>{msg}</div>}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookForm;
