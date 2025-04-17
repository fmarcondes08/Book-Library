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

// Validation schema
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
      function(value) {
        return value <= this.parent.totalCopies;
      }
    ),
  type: Yup.string().required('Type is required'),
  isbn: Yup.string().required('ISBN is required'),
  category: Yup.string().required('Category is required')
});

const BookForm: React.FC<BookFormProps> = ({ initialValues, onSubmit, isEditing }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h2>
      
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
          <Form>
            {status && (
              <div>
                {status instanceof Error ? status.message : String(status)}
              </div>
            )}
            
            <div>
              <div>
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                />
                <ErrorMessage name="title" component="div" />
              </div>
              
              <div>
                <label htmlFor="isbn">ISBN</label>
                <Field
                  type="text"
                  id="isbn"
                  name="isbn"
                />
                <ErrorMessage name="isbn" component="div" />
              </div>
              
              <div>
                <label htmlFor="firstName">Author First Name</label>
                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                />
                <ErrorMessage name="firstName" component="div" />
              </div>
              
              <div>
                <label htmlFor="lastName">Author Last Name</label>
                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                />
                <ErrorMessage name="lastName" component="div" />
              </div>
              
              <div>
                <label htmlFor="category">Category</label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                >
                  <option value="">Select a category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Biography">Biography</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="History">History</option>
                </Field>
                <ErrorMessage name="category" component="div" />
              </div>
              
              <div>
                <label htmlFor="type">Type</label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                >
                  <option value="">Select a type</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="E-Book">E-Book</option>
                  <option value="Audiobook">Audiobook</option>
                </Field>
                <ErrorMessage name="type" component="div" />
              </div>
              
              <div>
                <label htmlFor="totalCopies">Total Copies</label>
                <Field
                  type="number"
                  id="totalCopies"
                  name="totalCopies"
                  min="1"
                />
                <ErrorMessage name="totalCopies" component="div" />
              </div>
              
              <div>
                <label htmlFor="copiesInUse">Copies In Use</label>
                <Field
                  type="number"
                  id="copiesInUse"
                  name="copiesInUse"
                  min="0"
                />
                <ErrorMessage name="copiesInUse" component="div" />
              </div>
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookForm;