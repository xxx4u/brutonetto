﻿
using System;
using Membrane.Domain.Entity;
using Membrane.Domain.Store;

namespace Membrane.Domain.Persistence
{
    /// <summary>
	/// The marker interface for <see cref="OAuth2User"/> repositories.
    /// </summary>
	public interface IOAuth2UserRepository
        : IRepository<OAuth2User, Guid> { }
}
