#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveNull : Variable
  {
  public:
    const static char TypeName = 5;
    VariablePrimitiveNull();
    VariablePrimitiveNull(val value);

    const val raw() const;
  };
}