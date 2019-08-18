﻿/*
 * Magic, Copyright(c) Thomas Hansen 2019 - thomas@gaiasoul.com
 * Licensed as Affero GPL unless an explicitly proprietary license has been obtained.
 */

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using magic.common.contracts;
using magic.lambda.mssql.utilities;

namespace magic.lambda.mssql.init
{
    public class ConfigureServices : IConfigureServices
    {
        public void Configure(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient((svc) => svc.GetService<IScopedResolver>().GetScopedInstance<ConnectionStack>());
        }
    }
}
