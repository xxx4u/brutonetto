﻿
using System;
using System.Runtime.Serialization;
using Membrane.Foundation.ExceptionManagement;

namespace Membrane.Foundation.ExceptionManagement
{
	/// <summary>
	/// Represents an security exception.
	/// </summary>
    public class SecurityException : ApplicationModelException
	{
		/// <summary>
		/// Initializes a new instance of the WrappedException class.
		/// </summary>
        public SecurityException() : base() { }

        /// <summary>
        /// Initializes a new instance of the WrappedException class.
        /// </summary>
        /// <param name="number">The exception type that will escalate to the presentation layer.</param>
        public SecurityException(long number)
            : base(number, string.Format("0x{0:X}", number)) { }

		/// <summary>
		///  Initializes a new instance of the WrappedException class with a specified error message.
		///  </summary>
		/// <param name="message"> The message that describes the error.</param>
        public SecurityException(string message)
            : base(message) { }

        /// <summary>
        /// Initializes a new instance of the WrappedException class with a specified error message.
		/// </summary>
        /// <param name="number">The exception type that will escalate to the presentation layer.</param>
        /// <param name="message"> The message that describes the error.</param>
        public SecurityException(long number, string message)
            : base(number, message) { }

		/// <summary>
		/// Initializes a new instance of the WrappedException class with a specified
		/// error message and a reference to the inner exception that is the cause of
		/// this exception.
		/// </summary>
		/// <param name="message">The error message that explains the reason for the exception.</param>
		/// <param name="innerException">The exception that is the cause of the current exception, or a null reference if no inner exception is specified.</param>
        public SecurityException(string message, Exception innerException)
            : base(message, innerException) { }

        /// <summary>
        /// Initializes a new instance of the WrappedException class with a specified
        /// error message and a reference to the inner exception that is the cause of
        /// this exception.
        /// </summary>
        /// <param name="number">The exception type that will escalate to the presentation layer.</param>
        /// <param name="message">The error message that explains the reason for the exception.</param>
        /// <param name="innerException">The exception that is the cause of the current exception, or a null reference if no inner exception is specified.</param>
        public SecurityException(long number, string message, Exception innerException)
            : base(number, message, innerException) { }

		/// <summary>
		/// Initializes a new instance of the WrappedException class with serialized
		/// data.
		/// </summary>
		/// <param name="info">The System.Runtime.Serialization.SerializationInfo that holds the serialized object data about the exception being thrown.</param>
		/// <param name="context">The System.Runtime.Serialization.StreamingContext that contains contextual information about the source or destination.</param>
        protected SecurityException(SerializationInfo info, StreamingContext context)
            : base(info, context) { }
	}
}
