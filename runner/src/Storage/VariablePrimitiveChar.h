#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveChar : Variable
  {
  public:
    const static char TypeName = 7;
    VariablePrimitiveChar(char value);
    VariablePrimitiveChar(val value);

    const val raw() const;

  private:
    char value;
  };
}