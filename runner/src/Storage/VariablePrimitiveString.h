#include "./Variable.h"
#include "./Frame.h"
#include <string>

namespace Storage
{
  class VariablePrimitiveString : Variable
  {
  public:
    const static char TypeName = 6;
    VariablePrimitiveString(std::string value);
    VariablePrimitiveString(val value);

    const val raw() const;

  private:
    std::string value;
  };
}